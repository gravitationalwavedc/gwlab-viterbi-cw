import json
import os

from core.misc import working_directory
from db import get_unique_job_id, update_job
from scheduler.slurm import slurm_submit


def submit_template(wk_dir, job_name):
    return f"""#!/bin/bash
#SBATCH --time=00:10:00
#SBATCH --output={wk_dir}/submit/{job_name}_master_slurm.out
#SBATCH --error={wk_dir}/submit/{job_name}_master_slurm.err

jid0=($(sbatch {wk_dir}/submit/{job_name}_atoms.sh))

echo "jid0 ${{jid0[-1]}}" >> {wk_dir}/submit/slurm_ids

jid1=($(sbatch --dependency=afterok:${{jid0[-1]}} {wk_dir}/submit/{job_name}_viterbi.sh))

echo "jid1 ${{jid1[-1]}}" >> {wk_dir}/submit/slurm_ids"""


def atom_template(wk_dir, job_name, frequency):
    return f"""#!/bin/bash
#SBATCH --job-name={job_name}_atoms
#SBATCH --account=oz986
#SBATCH --ntasks=1
#SBATCH --time=2:00:00
#SBATCH --mem-per-cpu=16GB
#SBATCH --tmp=8GB
#SBATCH --cpus-per-task=1
#SBATCH --output={wk_dir}/atoms/{job_name}_atoms.out
#SBATCH --error={wk_dir}/atoms/{job_name}_atoms.err

. /fred/oz986/viterbi/lalapps/module_env.sh
. /fred/oz986/viterbi/bundle/venv/bin/activate
. /fred/oz986/viterbi/lalapps/v7.0.0/etc/lal-user-env.sh

srun python /fred/oz986/viterbi/bundle/venv/bin/jstat_viterbi_pipe.py --config-file {wk_dir}/{job_name}_atoms.ini \
--top-level-directory {wk_dir}/atoms/ \
--freq-start {frequency} \
--cache-files /fred/oz986/viterbi/cache/H1_O3_C01_gated.cache,/fred/oz986/viterbi/cache/L1_O3_C01_gated.cache \
--produce-atoms"""


def viterbi_template(wk_dir, job_name):
    return f"""#!/bin/bash
#SBATCH --job-name={job_name}_viterbi
#SBATCH --account=oz986
#SBATCH --ntasks=1
#SBATCH --time=00:45:00
#SBATCH --mem-per-cpu=16GB
#SBATCH --tmp=8GB
#SBATCH --cpus-per-task=1
#SBATCH --gres=gpu:1
#SBATCH --output={wk_dir}/viterbi/{job_name}_viterbi.out
#SBATCH --error={wk_dir}/viterbi/{job_name}_viterbi.err

mkdir -p {wk_dir}/viterbi/

. /fred/oz986/viterbi/lalapps/module_env.sh
. /fred/oz986/viterbi/bundle/venv/bin/activate
. /fred/oz986/viterbi/lalapps/v7.0.0/etc/lal-user-env.sh

python /fred/oz986/viterbi/bin/parse_atoms_size.py {wk_dir}/atoms/{job_name}_atoms.out {wk_dir}/{job_name}_viterbi.ini

srun python /fred/oz986/viterbi/bundle/venv/bin/jstat_viterbi_pipe.py --config-file {wk_dir}/{job_name}_viterbi.ini \
--top-level-directory decided_by_ini \
--run-viterbi-gpu"""


def atom_ini(input_params):
    return f"""[search]
search_type=jstatistic
alpha = {input_params['data']['alpha']}
delta = {input_params['data']['delta']}
freqBand = {input_params['data']['freq_band']}
minStartTime = {input_params['data']['min_start_time']}
maxStartTime = {input_params['data']['max_start_time']}
driftTime = {input_params['data']['drift_time']}
dFreq = {input_params['data']['d_freq']}
asini = {input_params['data']['asini']}
orbital-P = {input_params['data']['orbit_period']}
orbitTp = {input_params['data']['orbit_tp']}
ephemEarth = /fred/oz986/viterbi/ephems/earth00-40-DE436.dat
ephemSun = /fred/oz986/viterbi/ephems/sun00-40-DE436.dat
bandWingSize = -1"""


def viterbi_ini(wk_dir, input_params, frequency):
    atom_string = frequency.replace('.', '-')
    return f"""[search]
search_type = jstatistic_gpu
gpu_executable = /fred/oz986/viterbi/viterbi/viterbi_cuda/viterbi_jstat_search
cjs_atoms = {wk_dir}/atoms/{atom_string}/atoms-%d
start_time = {input_params['search']['search_start_time']}
tblock = {input_params['search']['search_t_block']}
central_a0 = {input_params['search']['search_central_a0']}
a0_band = {input_params['search']['search_a0_band']}
a0_bins = {input_params['search']['search_a0_bins']}
central_P = {input_params['search']['search_central_p']}
P_band = {input_params['search']['search_p_band']}
P_bins = {input_params['search']['search_p_bins']}
central_orbitTp = {input_params['search']['search_central_orbit_tp']}
orbitTp_band = {input_params['search']['search_orbit_tp_band']}
orbitTp_bins = {input_params['search']['search_orbit_tp_bins']}
ignore_wings = 524288
out_prefix = {wk_dir}/viterbi/results
print_ll = True
llthreshold = {input_params['search']['search_l_l_threshold']}"""


def submit(details, input_params):
    print("Submitting new job...")

    # Convert the job data to a json object
    input_params = json.loads(input_params)

    # Get the working directory
    wk_dir = working_directory(details, input_params)

    # Create the working directory
    os.makedirs(wk_dir, exist_ok=True)

    # Change to the working directory
    os.chdir(wk_dir)

    # Create the various directories
    submit_script_dir = os.path.join(wk_dir, 'submit')
    os.makedirs(submit_script_dir, exist_ok=True)
    os.makedirs(os.path.join(wk_dir, 'atoms'), exist_ok=True)
    os.makedirs(os.path.join(wk_dir, 'viterbi'), exist_ok=True)

    job_name = input_params["name"]
    frequency = str(float(input_params["data"]['start_frequency_band']))

    # Write slurm scripts
    submit_directory = 'submit'
    slurm_script = os.path.join(wk_dir, submit_directory, f'{job_name}_master_slurm.sh')
    with open(slurm_script, "w") as f:
        f.write(submit_template(wk_dir, job_name))

    with open(os.path.join(wk_dir, submit_directory, f'{job_name}_atoms.sh'), "w") as f:
        f.write(atom_template(wk_dir, job_name, frequency))

    with open(os.path.join(wk_dir, f'{job_name}_atoms.ini'), "w") as f:
        f.write(atom_ini(input_params))

    with open(os.path.join(wk_dir, submit_directory, f'{job_name}_viterbi.sh'), "w") as f:
        f.write(viterbi_template(wk_dir, job_name))

    with open(os.path.join(wk_dir, f'{job_name}_viterbi.ini'), "w") as f:
        f.write(viterbi_ini(wk_dir, input_params, frequency))

    # Actually submit the job
    submit_bash_id = slurm_submit(slurm_script, wk_dir)

    # If the job was not submitted, simply return. When the job controller does a status update, we'll detect that
    # the job doesn't exist and report an error
    if not submit_bash_id:
        return None

    # Create a new job to store details
    job = {
        'job_id': get_unique_job_id(),
        'submit_id': submit_bash_id,
        'working_directory': wk_dir,
        'submit_directory': submit_directory
    }

    # Save the job in the database
    update_job(job)

    # return the job id
    return job['job_id']
