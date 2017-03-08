"use strict";

var _cscs_split_time = function (timeString) {
    var hours = 0;
    var minutes = 0;
    var seconds = 0;

    var array = timeString.split(':');
    if(array.length == 3) {
        // assuming the case where we do not have the day
        hours = array[0];
        minutes = array[1];
        seconds = array[2];

    } else {
        return null;
    }

    return { 'hours' : hours, 'minutes' : minutes, 'seconds' : seconds };
};

var _cscs_compute_time_from_string = function (timeString) {
    var time = _cscs_split_time(timeString);

    if(time != null) {
        return Number(time.hours * 60.0) + Number(time.minutes);
    }
    return null;
};

var _cscs_compute_time = function (hours, minutes) {
    return Number(hours * 60.0) + Number(minutes);
};

var _cscs_compose_time = function (hours, minutes) {
    if(hours == null || hours == "undefined" || hours == "") {
        hours = 0;
    }
    if(minutes == null || minutes == "undefined" || minutes == "") {
        minutes = 0;
    }
    return _cscs_pad_interger(hours) + ":" + _cscs_pad_interger(minutes) + ":00";
};

var _cscs_pad_interger = function (number) {
    if (number < 10 && number != "00" 
        && number != "00" && number != "01" 
        && number != "02" && number != "03" 
        && number != "04" && number != "05"
        && number != "06" && number != "07" 
        && number != "08" && number != "09")
        return "0" + number;
    return number;
}
var _cscs_convert_time_string = function (timeString) {
    var time = _cscs_split_time(timeString);

    if(time != null) {
        return  _cscs_pad_interger(time.hours) + ":" + _cscs_pad_interger(time.minutes) + ":00";
    }
    return null;
};


var _bindPrototypeMethods = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

var Partition = function() {
    this.name = "partition";
    this.typeName = Partition;
    this.Partition = {
        "normal"  : "--partition=",
    };
    this.list_of_partitions = [ "normal" ];

    this.directive = "#SBATCH ";

    this.NumNodesDirective         = "--nodes=";
    this.NumGpusPerNodesDirective  = "--ntasks-per-node=";
    this.NumTasksPerNodesDirective = "--ntasks-per-node=";
    this.NumCpusPerTaskDirective   = "--cpus-per-task=";
    this.NumTasksPerCoreDirective  = "--ntask-per-core=";
    this.MemoryDirective           = "--mem=";
    this.EMailDirective            = "--mail-user=";
    this.NameDirective             = "--job-name=";
    this.ExclusiveDirective        = "--exclusive";
    this.WallTimeDirective         = "--time=";

    this.allow_node_sharing = {};

    this.pre_commands = {};
    this.default_executable = {};

    this.has_constraints = {};

    this.max_num_nodes = {
        "normal"  : 1
    };
    this.max_num_gpus = {
        "normal"  : 1
    };
    this.max_num_tasks_per_node = {
        "normal"  : 1
    };
    this.max_num_cpus_per_tasks = {
        "normal"  : 1
    };
    this.max_num_tasks_per_core = {
        "normal"  : 1
    };
    this.max_memory_per_node = {
        "normal"  : 120
    };
    this.max_wall_time = {
        "normal"  : "00:00:00"
    };

    this.target_time = 0;

};

Partition.prototype.getValue = function(propertyName) {
    var value = propertyName[this.name];
    if (value == "undefined" || value == null ||  value == "") {
        return null;
    }
    return value;
}

Partition.prototype.updateTimeGUI = function () {

    var target_time = this.getValue(this.max_wall_time);
    if (target_time == null) {
        $('#hours').val("0");
        $('#minutes').val("0");
        // $('#seconds').val("0");
    } else {
        var time = _cscs_split_time(target_time);
        $('#hours').val(time.hours);
        $('#minutes').val(time.minutes);
        // $('#seconds').val(time.seconds);
    }
};

Partition.prototype.hideGUIDataField = function(fieldid, fieldvalue) {
    var value = this.getValue(fieldvalue);
    if (value != null) {
        $(fieldid).show();
    } else {
        $(fieldid).hide();
    }
}

Partition.prototype.hideGUIBooleanField = function(fieldid, fieldvalue, referencevalue) {
    var value = this.getValue(fieldvalue);
    if (value != null && value == referencevalue) {
        $(fieldid).show();
    } else {
        $(fieldid).hide();
    }
}

Partition.prototype.updatePartitionsFields = function() {
    var _self = this;

    this.hideGUIBooleanField('#ExclusiveNodeGroup', this.allow_node_sharing, true);

    this.hideGUIDataField('#numberOfNodesGroup', this.max_num_nodes);
    this.hideGUIDataField('#numberOfTasksPerNodeGroup', this.max_num_tasks_per_node);
    this.hideGUIDataField('#numberOfCpusPerTasksGroup', this.max_num_cpus_per_tasks);
    this.hideGUIDataField('#numberTasksPerCoreGroup', this.max_num_tasks_per_core);
    this.hideGUIDataField('#bigMemoryGroup', this.max_memory_per_node);

    var value = this.getValue(this.default_executable);
    if (value == null) {
        $('#executableGroup').show();
    } else {
        $('#executableGroup').hide();
        $('#executable').val("");
    }
};

Partition.prototype.updatePartitionsInGUI = function() {
    var _self = this;

    for (var i = 0; i < _self.list_of_partitions.length; i++) {
        $('#selectPartition').append("<option>" + this.list_of_partitions[i] + "</option>");
    }

    $('#selectPartition').change(function(){
        // add here the changes when the partition changes
        __cscs_partition = new _self.typeName($(this).val());
        __cscs_partition.updatePartitionsFields();
        __cscs_partition.updateTimeGUI();
        // document.getElementById("jobscript").innerHTML = null;
        cscs_print_jobscript();
    });

    __cscs_partition.updatePartitionsFields();
    __cscs_partition.updateTimeGUI();
};

Partition.prototype.getPartition = function() {
    var value = this.getValue(this.Partition);
    if (value == null) {
        return "";
    }
    return this.directive + value + this.name + "\n";
};

Partition.prototype.getConstraints = function() {
    var value = this.getValue(this.has_constraints);
    if (value == null) {
        return "";
    }
    return this.directive + value + "\n";
};

Partition.prototype.getExclusive = function() {
    var value = $('#ExclusiveNode').prop("checked");
    var max = this.getValue(this.allow_node_sharing);
    if (max != null && value == true) {
        return this.directive + this.ExclusiveDirective + "\n";
    }
    return "";
};

Partition.prototype.getNumNodes = function() {
    var value = $('#numberOfNodes').val();
    var max = this.getValue(this.max_num_nodes);
    if (max != null && Number(value) > Number(max)) {
        value = max;
    } else if(max == null) {
        return "";
    }
    return this.directive + this.NumNodesDirective + value + "\n";
};

Partition.prototype.getNumTasksPerNodes = function() {
    var value = $('#numberOfTasksPerNode').val();
    var max = this.getValue(this.max_num_tasks_per_node);
    if (max != null && Number(value) > Number(max)) {
        value = max;
    } else if(max == null) {
        return "";
    }
    return this.directive + this.NumTasksPerNodesDirective + value + "\n";    
};

Partition.prototype.getNumCpusPerTask = function() {
    var value = $('#numberOfCpusPerTasks').val();
    var max = this.getValue(this.max_num_cpus_per_tasks);
    if (max != null && Number(value) > Number(max)) {
        value = max;
    } else if(max == null) {
        return "";
    }
    return this.directive + this.NumCpusPerTaskDirective + value + "\n";    
};

Partition.prototype.getNumTasksPerCore = function() {
    var value = $('#numberTasksPerCore').val();
    var max = this.getValue(this.max_num_tasks_per_core);
    if (max != null && Number(value) > Number(max)) {
        value = max;
    } else if(max == null) {
        return "";
    }
    return this.directive + this.NumTasksPerCoreDirective + value + "\n";    
};

Partition.prototype.getWallTime = function() {
    var hours = $('#hours').val();
    var minutes = $('#minutes').val();
    // var seconds = $('#seconds').val();

    var time        = _cscs_compute_time(hours, minutes);
    var time_string = _cscs_compose_time(hours, minutes);

    var max_time = this.getValue(this.max_wall_time);
    var max_time_string = _cscs_convert_time_string(max_time);
    var max_time_value = _cscs_compute_time_from_string(max_time);

    if (max_time != null && Number(time) > Number(max_time_value)) {
        time = max_time_value;
        time_string = max_time_string;
    } else if(max_time == null) {
        return "";
    }
    return this.directive + this.WallTimeDirective + time_string + "\n";    
};

Partition.prototype.getMemPerNode = function() {
    var value = $('#bigMemory').prop("checked");
    var max = this.getValue(this.max_memory_per_node);
    if (max != null && value == true) {
        value = max;
    } else if(max == null || value == false) {
        return "";
    }
    return this.directive + this.MemoryDirective + value + "GB\n";    
};

Partition.prototype.getExecutable = function() {
    var value = $('#executable').val();
    var max = this.getValue(this.default_executable);
    if (max != null && (value == "" || value == "undefined" || value == null)) {
        value = max;
    } else if (value == "" || value == "undefined" || value == null) {
        value = "./executable.x";
    }
    return "srun " + value;
};

Partition.prototype.getPreCommand = function() {
    var value = this.getValue(this.pre_commands);
    if (value != null && value != "" && value != "undefined") {
        return value + "\n";
    }
    return "";
};

Partition.prototype.print = function(element) {
    element.innerHTML  = "#!/bin/bash -l\n";

    var jobname = $('#jobName').val();
    var placeholderJobName = $('#jobName').prop("placeholder");
    if (jobname != "undefined" && jobname != null && jobname != "") {
        element.innerHTML += this.directive + this.NameDirective + jobname + "\n";
    } else if (placeholderJobName != "undefined" && placeholderJobName != null && placeholderJobName != ""){
        element.innerHTML += this.directive + this.NameDirective + placeholderJobName + "\n";
    }

    var emailAddress = $('#emailAddress').val();
    if (emailAddress != "undefined" && emailAddress != null && emailAddress != "") {
        element.innerHTML += this.directive + this.EMailDirective + emailAddress + "\n";
    }

    element.innerHTML += this.getWallTime();
    
    element.innerHTML += this.getNumNodes();
    element.innerHTML += this.getNumTasksPerNodes();
    element.innerHTML += this.getNumCpusPerTask();
    element.innerHTML += this.getNumTasksPerCore();
    element.innerHTML += this.getMemPerNode();
    element.innerHTML += this.getPartition();
    element.innerHTML += this.getConstraints();
    element.innerHTML += this.getExclusive();    


    element.innerHTML += "\n";
    element.innerHTML += this.getPreCommand();
    element.innerHTML += this.getExecutable();  
};

var DaintGPUPartition = function(name) {
    Partition.call(this);
    this.name = name;
    this.typeName = DaintGPUPartition;
    this.Partition = {
        "normal"  : "--partition=",
        "low"     : "--partition=",
        "high"    : "--partition=",
        "xfer"    : "--partition=",
        "prepost" : "--partition=",
        "debug"   : "--partition=",
    };

    this.max_wall_time = {
        "normal"  : "24:00:00",
        "low"     : "06:00:00",
        "high"    : "24:00:00",
        "xfer"    : "24:00:00",
        "prepost" : "00:30:00",
        "debug"   : "00:30:00"
    };

    this.list_of_partitions = [ "normal", "low", "high", "xfer", "prepost", "debug" ];

    this.allow_node_sharing = {
        "normal" : false
    }

    this.pre_commands = {
        xfer : "module unload xalt",
    };    

    this.default_executable = {
        xfer    : "rsync -av $1 $2\nif [ -n '$3' ]; then\n    sbatch --dependency=afterok:$SLURM_JOB_ID $3\nfi\n",
    };    
    
    this.has_constraints = {
        "normal" : '--constraint=gpu',
        "low"    : '--constraint=gpu',
        "high"   : '--constraint=gpu',
        "debug"  : '--constraint=gpu',
    };

    this.max_num_nodes = {
        "normal" : 2400,
        "low"    : 2400,
        "high"   : 2400,
        "debug"  : 4
    };
    
    this.max_num_gpus = {
        "normal" : 1,
        "low"    : 1,
        "high"   : 1,
        "debug"  : 1
    };

    this.max_num_tasks_per_node = {
        "normal" : 24,
        "low"    : 24,
        "high"   : 24,
        "debug"  : 24
    };

    this.max_num_cpus_per_tasks = {
        "normal" : 24,
        "low"    : 24,
        "high"   : 24,
        "debug"  : 24
    };

    this.max_num_tasks_per_core = {
        "normal" : 2,
        "low"    : 2,
        "high"   : 2,
        "debug"  : 2
    };

    this.max_memory_per_node = {
        "normal"  : 120
    };
};
_bindPrototypeMethods(DaintGPUPartition, Partition);

var DaintMCPartition = function(name) {
    DaintGPUPartition.call(this);
    this.name = name;
    this.typeName = DaintMCPartition;

    this.has_constraints = {
        "normal" : '--constraint=mc',
        "low"    : '--constraint=mc',
        "high"   : '--constraint=mc',
        "debug"  : '--constraint=mc'
    };

};
_bindPrototypeMethods(DaintMCPartition, DaintGPUPartition);

var MonchPartition = function(name) {
    Partition.call(this);
    this.name = name;
    this.typeName = MonchPartition;
    this.Partition = {
        normal   : "--partition=",
        largemem : "--partition="
    };
    this.list_of_partitions = [ "normal", "largemem" ];

    this.max_num_tasks_per_node = {
        "normal" : 72,
        "low"    : 72,
        "high"   : 72,
        "debug"  : 72
    };

    this.max_num_cpus_per_tasks = {
        "normal" : 72,
        "low"    : 72,
        "high"   : 72,
        "debug"  : 72
    };    
};
_bindPrototypeMethods(MonchPartition, Partition);
//     $('#selectPartition').append('<option>compute</option>');
//     $('#selectPartition').append('<option>largemem</option>');
//     $('#selectPartition').append('<option>hugemem</option>');
//     $('#selectPartition').append('<option>all</option>');
//     $('#selectPartition').append('<option>dphys_compute</option>');
//     $('#selectPartition').append('<option>dphys_largemem</option>');
//     $('#selectPartition').append('<option>dphys_hugemem</option>');
//     $('#selectPartition').append('<option>dphys_largemem_wk</option>');
//     $('#selectPartition').append('<option>dphys_hugemem_wk</option>');
//     $('#selectPartition').append('<option>fichtner_compute</option>');
//     $('#selectPartition').append('<option>parrinello_compute</option>');
//     $('#selectPartition').append('<option>spaldin_compute</option>');

var LeonePartition = function(name) {
    Partition.call(this);
    this.name = name;
    this.typeName = LeonePartition;
    this.Partition = {
        normal   : "--partition=",
        largemem : "--partition="
    };
    this.list_of_partitions = [ "normal", "debug", "longrun" ];
};
_bindPrototypeMethods(LeonePartition, Partition);

var TavePartition = function(name) {
    Partition.call(this);
    this.name = name;
    this.typeName = TavePartition;
    this.Partition = {
        normal   : "--partition=",
        largemem : "--partition="
    };
    this.list_of_partitions = [ "normal", "largemem" ];

    this.max_num_tasks_per_core = {
        "normal"   : 4,
        "largemem" : 4
    };

};
_bindPrototypeMethods(TavePartition, Partition);


var __cscs_partition = {};

function _cscs_clean_fields() {
    document.getElementById("selectPartition").innerHTML = null;
    document.getElementById("jobscript").innerHTML = null;
}

function cscs_populate_form() {
    __cscs_partition = new DaintGPUPartition("normal");
    __cscs_partition.updatePartitionsInGUI();
    cscs_print_jobscript();

    $("#selectMachine").change(function(){
        if ($(this).val() == "Daint Hybrid") {
            _cscs_clean_fields();
            __cscs_partition = new DaintGPUPartition("normal");
            __cscs_partition.updatePartitionsInGUI();
            cscs_print_jobscript();
        } else if ($(this).val() == "Daint MultiCore") {
            _cscs_clean_fields();
            __cscs_partition = new DaintMCPartition("normal");
            __cscs_partition.updatePartitionsInGUI();
            cscs_print_jobscript();
        } else if ($(this).val() == "Monch") {
            _cscs_clean_fields();
            __cscs_partition = new MonchPartition("normal");
            __cscs_partition.updatePartitionsInGUI();
            cscs_print_jobscript();
        } else if ($(this).val() == "Leone") {
            _cscs_clean_fields();
            __cscs_partition = new LeonePartition("normal");
            __cscs_partition.updatePartitionsInGUI();
            cscs_print_jobscript();
        } else if ($(this).val() == "Tave") {
            _cscs_clean_fields();
            __cscs_partition = new TavePartition("normal");
            __cscs_partition.updatePartitionsInGUI();
            cscs_print_jobscript();
        }
    });

    $("#submit_button").click(function() {
      cscs_print_jobscript();
    });
}

function cscs_print_jobscript() {
    document.getElementById("jobscript").innerHTML = null;
    __cscs_partition.print(document.getElementById("jobscript"));
    return true;
}

function cscs_validate_hour() {
    var hours = $('#hours').val();
    var minutes = $('#minutes').val();

    var time = _cscs_compute_time(hours, minutes);

    var max_time = __cscs_partition.getValue(__cscs_partition.max_wall_time);
    var max_time_value = _cscs_compute_time_from_string(max_time);

    if (max_time != null && Number(time) > Number(max_time_value)) {
        var h = _cscs_split_time(max_time);

        time = _cscs_compute_time(h.hours, minutes);
        if(Number(time) > Number(max_time_value)) {
            $('#hours').val("max", h.hours);
            $('#hours').val(h.hours - 1);
        } else {
            $('#hours').val("max", h.hours);
            $('#hours').val(h.hours);
        }

        return true;
    }
    return true;
}

function cscs_validate_minutes() {
    var hours = $('#hours').val();
    var minutes = $('#minutes').val();

    var time = _cscs_compute_time(hours, minutes);

    var max_time = __cscs_partition.getValue(__cscs_partition.max_wall_time);
    var max_time_value = _cscs_compute_time_from_string(max_time);

    if (max_time != null && Number(time) > Number(max_time_value)) {
        var h = _cscs_split_time(max_time);
        $('#minutes').val("max", h.minutes);
        $('#minutes').val(h.minutes);
        return true;
    }
    return true;
}







// function cscs_validate_form() {
//  $('#selectMachine').change(function(){
//      if ($(this).val() == 'Daint') {
//          _cscs_display_daint_partitions();
//      } else if ($(this).val() == 'Leone') {
//          _cscs_display_leone_partitions();
//      } else if ($(this).val() == 'Monch') {
//          _cscs_display_monch_partitions();
//      } else if ($(this).val() == 'Tave') {
//          _cscs_display_tave_partitions();
//      } 
//  });
//  $("#submit_button").click(function() {
//    _cscs_print_job_script();
//  }); 
// }

// function _cscs_clean_partitions() {
//     document.getElementById("selectPartition").innerHTML = null;
// }


// function _cscs_display_daint_partitions() {
//     _cscs_clean_partitions();
//     $('#selectPartition').append('<option>gpu</option>');
//     $('#selectPartition').append('<option>mc</option>');
//     $('#selectPartition').append('<option>debug</option>');
//     $('#selectPartition').append('<option>low</option>');
//     $('#selectPartition').append('<option>high</option>');
//     $('#selectPartition').append('<option>large</option>');
//     $('#selectPartition').append('<option>prepost</option>');
//     $('#selectPartition').append('<option>xfer</option>');

//     _cscs_number_of_nodes_dict = {
//         'gpu'     : 2400,
//         'mc'      : 2400,
//         'debug'   : 4,
//         'low'     : 2400,
//         'high'    : 2400,
//         'large'   : 4549,
//         'prepost' : 1,
//         'xfer'    : 1,
//     }
//     _cscs_max_wall_time_dict = {
//         'normal'  : 2400,
//         'debug'   : 4,
//         'low'     : 2400,
//         'high'    : 2400,
//         'large'   : 4549,
//         'prepost' : 1,
//         'xfer'    : 1,
//     }
// }

// function _cscs_display_leone_partitions() {
//     _cscs_clean_partitions();
//     $('#selectPartition').append('<option>normal</option>');
//     $('#selectPartition').append('<option>debug</option>');
//     $('#selectPartition').append('<option>longrun</option>');

//     _cscs_number_of_nodes_dict = {
//         'normal'  : 2,
//         'debug'   : 2,
//         'longrun' : 1,
//     }   
// }

// function _cscs_display_monch_partitions() {
//     _cscs_clean_partitions();
//     $('#selectPartition').append('<option>compute</option>');
//     $('#selectPartition').append('<option>largemem</option>');
//     $('#selectPartition').append('<option>hugemem</option>');
//     $('#selectPartition').append('<option>all</option>');
//     $('#selectPartition').append('<option>dphys_compute</option>');
//     $('#selectPartition').append('<option>dphys_largemem</option>');
//     $('#selectPartition').append('<option>dphys_hugemem</option>');
//     $('#selectPartition').append('<option>dphys_largemem_wk</option>');
//     $('#selectPartition').append('<option>dphys_hugemem_wk</option>');
//     $('#selectPartition').append('<option>fichtner_compute</option>');
//     $('#selectPartition').append('<option>parrinello_compute</option>');
//     $('#selectPartition').append('<option>spaldin_compute</option>');
//     $('#selectPartition').append('<option></option>');

//     _cscs_number_of_nodes_dict = {
//         'compute'            : 312,
//         'largemem'           : 40,
//         'hugemem'            : 24,
//         'all'                : 376,
//         'dphys_compute'      : 310,
//         'dphys_largemem'     : 40,
//         'dphys_hugemem'      : 24,
//         'dphys_largemem_wk'  : 12,
//         'dphys_hugemem_wk'   : 8,
//         'fichtner_compute'   : 310,
//         'parrinello_compute' : 310,
//         'spaldin_compute'    : 310,
//         'express_compute'    : 2,
//     }
// }

// function _cscs_display_tave_partitions() {
//     _cscs_clean_partitions();
//     $('#selectPartition').append('<option>normal</option>');
//     $('#selectPartition').append('<option>debug</option>');
//     $('#selectPartition').append('<option>low</option>');
//     $('#selectPartition').append('<option>high</option>');
//     $('#selectPartition').append('<option>large</option>');
//     $('#selectPartition').append('<option>prepost</option>');
//     $('#selectPartition').append('<option>xfer</option>');

//     _cscs_number_of_nodes_dict = {
//         'normal'  : 512,
//         'debug'   : 512,
//         'low'     : 512,
//         'high'    : 512,
//         'large'   : 512,
//         'prepost' : 512,
//         'xfer'    : 512,
//     }
// }

// function _cscs_print_job_script() {
//     document.getElementById("jobscript").innerHTML = null;
//     document.getElementById("jobscript").innerHTML += "#!/bin/bash -l\n";
//     document.getElementById("jobscript").innerHTML += "$SBATCH --nodes=" + $("#numberOfNodes").val() + " \n";
//     document.getElementById("jobscript").innerHTML += "$SBATCH --ntasks-per-node=" + $("#numberOfTasksPerNode").val() + " \n";
//     document.getElementById("jobscript").innerHTML += "$SBATCH --cpus-per-task=" + $("#numberOfCpusPerTasks").val() + " \n";
//     if ($("#HyperThreading").prop("checked") == false) {
//         document.getElementById("jobscript").innerHTML += "$SBATCH --nomultithread\n";
//         document.getElementById("jobscript").innerHTML += "$SBATCH --nomultithread\n";
//     }
//     if ($("#ShareNode").prop("checked") == false) {
//         document.getElementById("jobscript").innerHTML += "$SBATCH --exclusive\n";
//     }


//         // self.num_tasks_per_node = None
//         // self.num_gpus_per_node = 0
//         // self.num_cpus_per_task = None
//         // self.num_tasks_per_core = None
//         // self.num_tasks_per_socket = None
//         // self.use_multithreading = False  

//  //  1 #!/bin/bash -l                                                                  
//  //  2 #SBATCH --job-name="score_p_C_daint_gpu_PrgEnv-cray"                            
//  //  3 #SBATCH --time=0:10:0                                                           
//  //  4 #SBATCH --ntasks=3                                                              
//  //  5 #SBATCH --ntasks-per-node=3                                                     
//  //  6 #SBATCH --cpus-per-task=4                                                       
//  //  7 #SBATCH --exclusive                                                             
//  //  8 #SBATCH --hint=nomultithread                                                    
//  //  9 #SBATCH --output="/users/hvictor/Work/score-p/PyRegression/regstage/gpu/score_p_C/PrgEnv-cray/score_p_C.out"
//  // 10 #SBATCH --error="/users/hvictor/Work/score-p/PyRegression/regstage/gpu/score_p_C/PrgEnv-cray/score_p_C.err"
//  // 11 #SBATCH --constraint=gpu     


// }

